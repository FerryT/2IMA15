// A cubic time algorithm which simply tries all possible lines,
// and checks whether or not it is a good one.
function NaiveAlgorithm(PointGroupOne, PointGroupTwo, returnMostHorizontal)
{
    returnMostHorizontal = returnMostHorizontal || false;
	// When there is an even number of points, leave out the last point
    var groupOneLength = PointGroupOne.length + (PointGroupOne.length%2 - 1);
	var groupTwoLength = PointGroupTwo.length + (PointGroupTwo.length%2 - 1);
    var candidateList = [];

	for(var i = 0; i < groupOneLength; i++)
	{		
		for(var j = 0; j < groupTwoLength; j++)
		{
			var p1 = PointGroupOne[i].clone();
			var p2 = PointGroupTwo[j].clone();
			var candidateLine = new Line(p1, p2);

			// We allow for a difference of one if the groups are of even size
			// the naive algorithm could be expanded to not need this.
			var allowOneDifference = false;
			var isProperCut = NaiveCheckIfLineIsProperCut(candidateLine, PointGroupOne.slice(0,groupOneLength), PointGroupTwo.slice(0,groupTwoLength), allowOneDifference);
			if(isProperCut)
			{
				// If for both group 1 and group 2, there are as many points left as right of the line,
				// it is the line we're looking for - and can stop looking.

                // When there is an even number of points, search the point that is closest to the candidate line (on the side of the left out point)
                var minDistOne = 0;
                var closestPoint = p1;
                var p1median = p1.clone();
                if(PointGroupOne.length%2 == 0)
                {
                    for(var k = 0; k < groupOneLength+1; k++)
                    {
                         var distanceToLine = candidateLine.distance(PointGroupOne[k])*candidateLine.orientation(PointGroupOne[k])*candidateLine.orientation(PointGroupOne[groupOneLength]);
                         if(k != i && (distanceToLine < minDistOne || minDistOne == 0) && distanceToLine > 0) {
                                 minDistOne = distanceToLine;
                                 closestPoint = PointGroupOne[k];
                         }
                    }
                    p1median.x = (closestPoint.x+p1.x)/2;
                    p1median.y = (closestPoint.y+p1.y)/2;
                }
                
                var minDistTwo = 0;
                closestPoint = p2;
                var p2median = p2.clone();
                if(PointGroupTwo.length%2 == 0)
                {
                    for(var l = 0; l < groupTwoLength+1; l++)
                    {
                         var distanceToLine = candidateLine.distance(PointGroupTwo[l])*candidateLine.orientation(PointGroupTwo[l])*candidateLine.orientation(PointGroupTwo[groupTwoLength]);
                         if(l != j && (distanceToLine < minDistTwo || minDistTwo == 0) && distanceToLine > 0) {
                                 minDistTwo = distanceToLine;
                                 var closestPoint = PointGroupTwo[l];
                         }
                    }
                    p2median.x = (closestPoint.x+p2.x)/2;
                    p2median.y = (closestPoint.y+p2.y)/2;
                }

                // First check whether a line through the medians is possible
                candidateLine = new Line(p1median,p2median);
                if(NaiveCheckIfLineIsProperCut(candidateLine, PointGroupOne, PointGroupTwo, allowOneDifference))
                {
                    candidateList.push(candidateLine.clone());
                }
                else
                {
                    var minDist = Math.min(minDistOne,minDistTwo);
                    p1median.x = p1.x+(p1median.x-p1.x)*minDist/minDistOne;
                    p1median.y = p1.y+(p1median.y-p1.y)*minDist/minDistOne;
                    p2median.x = p2.x+(p2median.x-p2.x)*minDist/minDistTwo;
                    p2median.y = p2.y+(p2median.y-p2.y)*minDist/minDistTwo;

                    // Otherwise check whether the line can be shifted perpendicular to the median with the smallest distance
                    var oldLine = new Line(p1,p2);
                    candidateLine = new Line(p1median,p2median);
                    if(oldLine.orientation(PointGroupOne[groupOneLength]) == oldLine.orientation(PointGroupTwo[groupTwoLength])
                        && NaiveCheckIfLineIsProperCut(candidateLine, PointGroupOne, PointGroupTwo, allowOneDifference))
                    {
                        candidateList.push(candidateLine.clone());
                    }
                    else
                    {
                        candidateList.push(new Line(p1,p2));
                    }
                }
                candidateList.push(new Line(p1,p2));
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