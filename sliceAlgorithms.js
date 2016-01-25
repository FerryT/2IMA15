function DualityAlgorithm(pointGroupOne, pointGroupTwo, goalPoint)
{
    // Convert to dual represenation
    dualGroupOne = pointGroupOne.map(function(obj){return obj.dual();});
    dualGroupTwo = pointGroupTwo.map(function(obj){return obj.dual();});

    // Find intersections of n-level
    var findAllIntersections = function(obj, lines)
    { 
        var intersections = [];
        for(var i = 0; i < lines.length; i++)
        {
            // Only non-parallel lines intersect
            if(obj.slope() != lines[i].slope())
            {
                intersections.push([obj.intersectionWith(lines[i]),i]);
            }
        }
        return intersections;
    };
    intersectionGroupOne = dualGroupOne.map(function(obj){return findAllIntersections(obj, dualGroupOne);});
    intersectionGroupTwo = dualGroupTwo.map(function(obj){return findAllIntersections(obj, dualGroupTwo);});
    crossGroupIntersections = dualGroupOne.map(function(obj){return findAllIntersections(obj, dualGroupTwo);});

    // Find the left-most intersection, so we can determine the start of the median line (left of that intersection)
    leftMostIntersection = intersectionGroupOne
                            .concat(intersectionGroupTwo)
                            .concat(crossGroupIntersections)
                            .reduceRight(function(a,b){return a.concat(b);}, []) // Flatten lists
                            .map(function(obj){return obj[0].x;})  // Only look at x-values
                            .reduceRight(function(a, b) { return Math.min(a,b);} , Infinity); // Find minimal x-value

    xBeforeAnyIntersection = leftMostIntersection - 1;
    medianIndexG1 = FindIndexOfNthHighestLineAtX(dualGroupOne, Math.floor(dualGroupOne.length/2), xBeforeAnyIntersection);
    medianIndexG2 = FindIndexOfNthHighestLineAtX(dualGroupTwo, Math.floor(dualGroupTwo.length/2), xBeforeAnyIntersection);
    
    // Find the intersection of the two median lines
    intersections = FindMedianIntersections(dualGroupOne, dualGroupTwo, 
                                            medianIndexG1, medianIndexG2, 
                                            intersectionGroupOne, intersectionGroupTwo, 
                                            xBeforeAnyIntersection);

    // Intersections of median lines correspond to a proper pizza cut
    if(intersections.length>0 && goalPoint == undefined)
    {
        return intersections.sort(function(a,b){ return Math.abs(a.x) - Math.abs(b.x); })[0].dual();
    }
    else if(intersections.length>0 && goalPoint != undefined)
    {
        distanceToGoal = function(point) { return point.EuclideanDistance(goalPoint);};
        return intersections.sort(function(a,b){ return distanceToGoal(a) - distanceToGoal(b); })[0].dual();
    }
    else
    {
        console.log("No median line found.");
    }
    // Convert intersection back to normal level
    return new Line(0,0,0,0);
}

function FindIndexOfNthHighestLineAtX(lineGroup, n, x)
{
    yValues =  lineGroup.map(function(obj){return obj.atX(x - 0.5);});

    // Find the y-value of the median line by sorting the lines based on y
    compareNumbers = function(a,b){return a-b;};
    mediany1 = yValues.slice().sort(compareNumbers)[n];

    // Then look up at which index of the unsorted array it is located
    return yValues.indexOf(mediany1);
}

function FindMedianIntersections(dualGroupOne, dualGroupTwo, indexOfMedianLine1, indexOfMedianLine2, intersectionGroupOne, intersectionGroupTwo, xOfLastIntersect)
{
    intersections = []
    while(true)
    {
        currentMedianLine1 = dualGroupOne[indexOfMedianLine1];
        currentMedianLine2 = dualGroupTwo[indexOfMedianLine2];
        nextIntersect1 = intersectionGroupOne[indexOfMedianLine1]
                            .sort(function(a,b){return a[0].x - b[0].x;})
                            .find(function(obj){return obj[0].x > xOfLastIntersect});
        nextIntersect2 = intersectionGroupTwo[indexOfMedianLine2]
                            .sort(function(a,b){return a[0].x - b[0].x;})
                            .find(function(obj){return obj[0].x > xOfLastIntersect});

        if(currentMedianLine1.slope() != currentMedianLine2.slope())
        {
            // If the medians are non-parallel, they will intersect
            // if they intersect before they intersect with another line in their group
            // they are median lines when they intersect, and thus found our point!
            medianIntersect = currentMedianLine1.intersectionWith(currentMedianLine2);
            if(     xOfLastIntersect < medianIntersect.x 
                && (nextIntersect1 == undefined || medianIntersect.x < nextIntersect1[0].x)
                && (nextIntersect2 == undefined || medianIntersect.x < nextIntersect2[0].x))
            {
                intersections.push(medianIntersect);
                //return medianIntersect.dual();
            }
        }
        if(nextIntersect1 == undefined  && nextIntersect2 == undefined)
        {
            // Median lines won't change anymore.
            break;
        }
        if((nextIntersect2 == undefined && nextIntersect1 != undefined) 
            || (nextIntersect1 != undefined && nextIntersect1[0].x <= nextIntersect2[0].x))
        {
            // intersect point + slope!=
            xOfLastIntersect = nextIntersect1[0].x;
            indexOfMedianLine1 = nextIntersect1[1];

        }
        if((nextIntersect1 == undefined && nextIntersect2 != undefined)
            || (nextIntersect2 != undefined && nextIntersect1[0].x > nextIntersect2[0].x))
        {
            // intersect point + slope!=
            xOfLastIntersect = nextIntersect2[0].x;
            indexOfMedianLine2 = nextIntersect2[1];
        }
    }
    return intersections;
}

// A cubic time algorithm which simply tries all possible lines,
// and checks whether or not it is a good one.
function NaiveAlgorithm(PointGroupOne, PointGroupTwo, returnMostHorizontal)
{
    returnMostHorizontal = returnMostHorizontal || false;
	// When there is an even number of points, leave out the last point
    var groupOneLength = PointGroupOne.length;
	var groupTwoLength = PointGroupTwo.length;
    var candidateList = [];

	for(var i = 0; i < groupOneLength; i++)
	{		
		for(var j = 0; j < groupTwoLength; j++)
		{
			var p1 = PointGroupOne[i].clone();
			var p2 = PointGroupTwo[j].clone();
			var candidateLine = new Line(p1, p2);

			// We allow for a difference of one if the groups are of even size
			var allowOneDifference = true;
			var isProperCut = NaiveCheckIfLineIsProperCut(candidateLine,
                                                         PointGroupOne.slice(0,groupOneLength),
                                                         PointGroupTwo.slice(0,groupTwoLength),
                                                         allowOneDifference);
			if(isProperCut)
			{
                candidateList.push(candidateLine.clone());               
			}

            if(!returnMostHorizontal && candidateList.length > 0)
                return candidateList[0];
		}
	}

    var mostHorizontalLine = candidateList[0];
    for(var i = 1; i < candidateList.length; i++)
    {
        if(Math.abs(mostHorizontalLine.slope()) > Math.abs(candidateList[i].slope))
        {
            mostHorizontalLine = candidateList[i];
        }
    }
    return mostHorizontalLine;
}

// A function which checks whether or not the given line divides both
// point groups in half, using a linear time algorithm
function NaiveCheckIfLineIsProperCut(line, pointGroupOne, pointGroupTwo, allowOneDifference)
{
	allowOneDifference = allowOneDifference || false;
	var groupOneLength = pointGroupOne.length;
	var groupTwoLength = pointGroupTwo.length;

	// Stores how many points are left/on/right of the line
	var groupOnePositions = [0,0,0];
	var groupTwoPositions = [0,0,0];

	// Given we have a candidate line, we can just count all other points
	// to see whether or not the candidate line is a good split
	// Note that even if we evaluate the points which make up the line,
	// it doesn't matter as they'll be on the line.
	for(var k = 0; k < groupOneLength; k++)
	{
		var p = pointGroupOne[k];
		var pos = line.orientation(p);
		groupOnePositions[pos + 1]++;
	}

	for(var k = 0; k < groupTwoLength; k++)
	{
		var p = pointGroupTwo[k];
		var pos = line.orientation(p);
		groupTwoPositions[pos + 1]++;
	}

	// The groups are split well if both have equally many points on either side
	var groupOneWellSplit = (groupOnePositions[0] == groupOnePositions[2]);
	var groupTwoWellSplit = (groupTwoPositions[0] == groupTwoPositions[2]);

	// However, if a group is of even size, then there won't be a split with as many points
	// to the left as to the right, so we allow for a difference of one (if we evaluate a slice through two points)
	if(allowOneDifference)
	{
		if(groupOneLength % 2 == 0)
		{
			groupOneWellSplit = ((groupOnePositions[0] + 1 == groupOnePositions[2]) || (groupOnePositions[0] - 1 == groupOnePositions[2]));
		}
		if(groupTwoLength % 2 == 0)
		{
			groupTwoWellSplit = ((groupTwoPositions[0] + 1 == groupTwoPositions[2]) || (groupTwoPositions[0] - 1 == groupTwoPositions[2]));
		}
	}


	// If for both group 1 and group 2, there are as many points left as right of the line, it is a proper cut
	return groupOneWellSplit && groupTwoWellSplit;
}